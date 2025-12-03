import { postValidationSchema } from "@/core/types/schemas/postValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";


const useCreatePostViewModel = () => {
  const { control } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(postValidationSchema)
  })

  console.log(control)

  return { control };
}

export default useCreatePostViewModel;