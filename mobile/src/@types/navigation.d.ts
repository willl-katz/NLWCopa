export declare global {
    namespace ReactNavigation {
        interface RootParamList {
            new: undefined;
            pools: undefined;
            // Não irá receber parâmetros
            find: undefined;
            // Irá receber parâmetros
            details: {
                id: string;
            }
        }
    }
}