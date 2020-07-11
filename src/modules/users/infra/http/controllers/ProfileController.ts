import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import UpdateProfileService from '../../../services/UpdateProfileService';
import ShowProfileService from '../../../services/ShowProfileService';

export default class ProfileController {
    public async show(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;
        const showProfile = container.resolve(ShowProfileService);

        const user = await showProfile.execute(user_id);

        return response.json({ user: classToClass(user) });
    }

    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const user_id = request.user.id;
        const { name, email, old_password, password } = request.body;
        const updateProfile = container.resolve(UpdateProfileService);
        const user = await updateProfile.execute({
            user_id,
            name,
            email,
            old_password,
            password,
        });

        // console.log(classToClass(user));

        return response.json({ user: classToClass(user) });
    }
}