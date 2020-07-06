import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';
import IAppoitmentsRepository from '../repositories/IAppoitmentsRepositories';
import Appointment from '../infra/typeorm/entities/Appointment';
import ICacheProvider from '../../../shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
    provider_id: string;
    month: number;
    year: number;
    day: number;
}

@injectable()
export default class ListProviderAppoitmentsService {
    constructor(
        @inject('AppoitmentsRepository')
        private appoitmentsRepository: IAppoitmentsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({
        provider_id,
        day,
        month,
        year,
    }: IRequest): Promise<Appointment[]> {
        const cacheKey = `provider-appoitments:${provider_id}:${year}-${month}-${day}`;
        let appoitments = await this.cacheProvider.recover<Appointment[]>(
            cacheKey,
        );

        if (!appoitments) {
            appoitments = await this.appoitmentsRepository.findAllInDayFromProvider(
                {
                    provider_id,
                    day,
                    month,
                    year,
                },
            );

            console.log('A query no banco foi feita');

            await this.cacheProvider.save(cacheKey, classToClass(appoitments));
        }

        return classToClass(appoitments);
    }
}
