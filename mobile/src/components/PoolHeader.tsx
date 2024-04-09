import { Heading, HStack, Text, VStack } from 'native-base';

import { PoolCardProps } from './PoolCard';
import { Participants } from './Participants';

import { X } from 'phosphor-react-native';
import { TouchableOpacity } from 'react-native';

interface Props {
  data: PoolCardProps;
  hendleDeletePool?: () => void;
}

export function PoolHeader({ data, hendleDeletePool }: Props) {
  const idUser = String(data.id);
  const idOwner = String(data.ownerId);

  return (
    <HStack
      w="full"
      h={20}
      bgColor="transparent"
      borderBottomWidth={1}
      borderBottomColor="gray.600"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
      p={4}
    >
      <VStack>
        <Heading color="white" fontSize="md" fontFamily="heading">
          {data.title}
        </Heading>

        <HStack>
          <Text color="gray.200" fontSize="xs" mr={1}>
            Código:
          </Text>

          <Text color="gray.200" fontSize="xs" fontFamily="heading">
            {data.code}
          </Text>
        </HStack>
      </VStack>

      <HStack  alignItems="center">
        <Participants
          count={data._count?.participants}
          participants={data.participants}
        />
        <HStack w={4}></HStack>
        <TouchableOpacity onPress={hendleDeletePool}>
          <X size={24} color="#e61919" weight="bold" />
        </TouchableOpacity>
      </HStack>
    </HStack>
  );
}