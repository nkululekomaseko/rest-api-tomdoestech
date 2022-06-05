import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { object, string, TypeOf } from "zod";
import axios from "axios";

const createSessionSchema = object({
  email: string().min(1, "Email is required"),
  password: string().min(1, "Password is required"),
});

type CreateSessionInput = TypeOf<typeof createSessionSchema>;

const LoginPage = (): JSX.Element => {
  const router = useRouter();
  const [loginError, setLoginError] = useState(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateSessionInput>({
    resolver: zodResolver(createSessionSchema),
  });

  const onSubmit = async (values: CreateSessionInput) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/sessions`,
        values,
        { withCredentials: true }
      );
      router.push("/");
    } catch (error: any) {
      setLoginError(error.message);
    }
  };

  // console.log({ errors });

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-element">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="jane.doe@example.com"
            {...register("email")}
          />
          <p>{errors.email?.message}</p>
        </div>
        <div className="form-element">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="******"
            {...register("password")}
          />
          <p>{errors.password?.message}</p>
        </div>
        <button type="submit">SUBMIT</button>
      </form>
      <p>{loginError}</p>
    </>
  );
};

export default LoginPage;
