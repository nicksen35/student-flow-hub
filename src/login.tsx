import React, { FC } from 'react';
import { GoogleLogin } from "@react-oauth/google";

interface LoginPageProps {}

const LoginPage: FC<LoginPageProps> = () => {
  const responseMessage = (response: any) => {
    console.log(response);
  };

  const errorMessage = (error: any) => {
    console.log(error);
  };

  return (
    <div>
      <h2>React Google Login</h2>
      <br />
      <br />
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
    </div>
  );
};

export default LoginPage;
