import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native"

const UserInfo = () => {
  const userId = useLocalSearchParams();
  if (!userId) {
    return <Text>No se proporciono el id</Text>
  }
  return (
    <View>
      <Text style={{ color: 'white' }}>
        Estas buscando este id de usuario: {userId.id}, y aun no se como buscarlo jahsjahsg
      </Text>
    </View>
  )
}

export default UserInfo;