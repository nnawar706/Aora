import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

import { images } from "../../constants";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
// import { createUser } from "../../lib/appwrite";
// import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
  // const { setUser, setIsLogged } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setIsSubmitting(true);

    try {
      // const result = await createUser(form.email, form.password, form.username);
      // setUser(result);
      // setIsLogged(true);

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[34px]"
          />

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Sign Up to Aora
          </Text>

          <InputField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-5"
          />

          <InputField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-5"
            keyboardType="email-address"
          />

          <InputField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-5"
          />

          <Button
            title="Sign Up"
            handlePress={handleSubmit}
            containerStyles="mt-5"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-1">
            <Text className="text-sm text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-sm font-psemibold text-secondary"
            >
              Signin
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;