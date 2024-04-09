import { createContext, ReactNode, useState, useEffect } from "react";
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { api } from '../services/api';

// Garante o redirecionamento do navegador
WebBrowser.maybeCompleteAuthSession();

interface UserProps {
    name: string;
    avatarUrl: string;
}

export interface AuthContextDataProps {
    user: UserProps;
    isUserLoading: boolean;
    signIn: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

// Criara um context que vai passar para toda aplicação
export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>({} as UserProps)
    // Vai anotar se o fluxo de autenticação esta acontecendo
    const [isUserLoading, setIsUserLoading] = useState(false)

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.CLIENT_ID,
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
        scopes: ['profile', 'email']
    })

    // Gerara o link para utilização no URIs de redirecionamento autorizados
    // console.log(AuthSession.makeRedirectUri({ useProxy: true }))

    async function signIn() {
        try {
            setIsUserLoading(true);
            await promptAsync();
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setIsUserLoading(false);
        }
    }

    async function signInWithGoogle(_token: string) {
        // Irá me gerar o TOKEN de autenticação do google
        console.log("TOKEN DE AUTENTICAÇÃO ===> ", _token);

        try {
            setIsUserLoading(true);

            const tokenResponse = await api.post('/users', { _token });
            api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`

            // buscar dados no nosso back-end
            const userInfoResponse = await api.get('/me');
            setUser(userInfoResponse.data.user)

        } catch (error){
            console.log(error);
            throw error;
        } finally {
            setIsUserLoading(false);
        }
    }

    // Lançar uma lógica observando response
    useEffect(() => {
        // Verificar se dentro do response existe um type e se é igual a 
        if (response?.type === 'success' && response.authentication?.accessToken) {
            signInWithGoogle(response.authentication.accessToken)
        }
    }, [response])

    return (
        // Vai prover os valores para compartilhar
        <AuthContext.Provider value={{
            signIn,
            isUserLoading,
            user,
        }}>
            {children}
        </AuthContext.Provider>
    )
}