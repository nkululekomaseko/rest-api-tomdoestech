import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { object, string, TypeOf } from "zod";
import axios from "axios";

const createUserSchema = object({
  name: string().min(1, "Name is required"),
  password: string()
    .min(1, "Password is required")
    .min(6, "Password too short - Should be 6 chars minimum"),
  passwordConfirmation: string().min(1, "Password confirmation is required"),
  email: string().min(1, "Email is required").email("Not a valid email"),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

type CreateUserInput = TypeOf<typeof createUserSchema>;

const RegisterPage = (): JSX.Element => {
  const router = useRouter();
  const [registerError, setRegisterError] = useState(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = async (values: CreateUserInput) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users`,
        values
      );
      router.push("/");
    } catch (error: any) {
      setRegisterError(error.message);
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
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Jane Doe"
            {...register("name")}
          />
          <p>{errors.name?.message}</p>
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
        <div className="form-element">
          <label htmlFor="passwordConfirmation">Confirm Password</label>
          <input
            id="passwordConfirmation"
            type="password"
            placeholder="******"
            {...register("passwordConfirmation")}
          />
          <p>{errors.passwordConfirmation?.message}</p>
        </div>
        <button type="submit">SUBMIT</button>
      </form>
      <p>{registerError}</p>
    </>
  );
};

export default RegisterPage;
