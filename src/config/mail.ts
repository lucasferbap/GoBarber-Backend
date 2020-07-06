interface IMailConfig {
    driver: 'ethereal' | 'ses';
    defaults: {
        from: {
            email: string;
            name: string;
        };
    };
}

export default {
    driver: process.env.MAIL_DRIVER || 'ethereal',

    defaults: {
        from: {
            email: 'lucas.fernandes@sitiovaleviver.com.br',
            name: 'Lucas Do Sítio Vale Viver',
        },
    },
} as IMailConfig;
