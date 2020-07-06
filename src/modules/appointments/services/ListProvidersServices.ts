import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';
import IUserRepository from '../../users/repositories/IUsersRepository';
import User from '../../users/infra/typeorm/entities/User';
import ICacheProvider from '../../../shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
    user_id: string;
}

@injectable()
export default class ListProvidersService {
    constructor(
        @inject('UsersRepository')
        private userRepositry: IUserRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({ user_id }: IRequest): Promise<User[]> {
        let users = await this.cacheProvider.recover<User[]>(
            `providers-list:${user_id}`,
        );

        if (!users) {
            users = await this.userRepositry.findAlProviders({
                except_user_id: user_id,
            });

            console.log(' A query do banco foi feita ');

            await this.cacheProvider.save(
                `providers-list:${user_id}`,
                classToClass(users),
            );
        }

        return users;
    }
}
