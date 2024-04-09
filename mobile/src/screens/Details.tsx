import { useToast, VStack, HStack } from 'native-base';
import { Share } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';

import { api } from '../services/api';

import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { PoolCardProps } from '../components/PoolCard'
import { PoolHeader } from '../components/PoolHeader';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Option } from '../components/Option';
import { Guesses } from '../components/Guesses';

interface RouteParams {
    id: string;
}

export function Details() {
    const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses')
    const [isLoading, setIsLoading] = useState(false);
    const [poolDatails, setPoolDatails] = useState<PoolCardProps>({} as PoolCardProps)

    const toast = useToast();
    const { navigate } = useNavigation();

    // Vou pegar o id dos parametros das rotas
    const route = useRoute();
    const { id } = route.params as RouteParams;

    async function fetchPoolDatails() {
        try {
            setIsLoading(true)

            const response = await api.get(`/pools/${id}`)
            setPoolDatails(response.data.pool);
            
            
        } catch (error) {
            console.log(error)

            toast.show({
                title: 'Não foi possível carregar os detalhes do bolão',
                placement: 'top',
                bgColor: 'red.500',
            })
        } finally {
            setIsLoading(false)
        }
    }

    async function handleCodeShere() {
       await Share.share({
        message: poolDatails.code
       }); 
    }

    async function hendleDeletePool() {
        try {
            setIsLoading(true)

            await api.delete(`/pools/${id}`)

            return navigate('pools')
            
        } catch (error) {
            console.log(error)

            toast.show({
                title: 'Não foi possível apagar o bolão',
                placement: 'top',
                bgColor: 'red.500',
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPoolDatails();
    }, [id]);

    if(isLoading) {
        return <Loading />
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header 
                title={poolDatails.title} 
                showBackButton 
                showShareButton
                onShare={handleCodeShere}
            />

            {
                poolDatails._count?.participants > 0 ?
                <VStack px={5} flex={1}>
                    <PoolHeader data={poolDatails} hendleDeletePool={hendleDeletePool} />

                    <HStack bgColor="gray.800" p={1} rounded="sm" mb={5} >
                        <Option 
                            title="Seus palpites" 
                            isSelected={optionSelected === 'guesses'}
                            onPress={() => setOptionSelected('guesses')}
                        />
                        <Option 
                            title="Ranking do grupo" 
                            isSelected={optionSelected === 'ranking'}
                            onPress={() => setOptionSelected('ranking')}
                        />
                    </HStack>

                    <Guesses poolId={poolDatails.id} code={poolDatails.code} />
                </VStack>
                : <EmptyMyPoolList code={poolDatails.code} />
            }
            
        </VStack>
    )
}