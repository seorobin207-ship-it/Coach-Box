import "./index.scss";
import {bgLogin} from "@app/config/images";
import {ForgotPassword} from "@module/login/ForgotPassword";
import {SignIn} from "@module/login/SignIn";
import Image from "next/image";
import React, {useState} from "react";

export function Login(): JSX.Element {
  const [tab, setTab] = useState("signIn");

  const tabList = {
    signIn: {
      component: SignIn,
    },
    forgotPassword: {
      component: ForgotPassword,
    },
  };

  const ActiveComponent = tabList[tab as keyof typeof tabList].component;

  return (
    <div className="flex w-full min-h-screen flex-col lg:flex-row">
      {/* Background Banner */}
      <div className="hidden lg:block lg:w-[70%] xl:w-[75%]">
        <Image
          src={bgLogin}
          alt="banner"
          className="h-screen w-full object-cover"
        />
      </div>

      {/* Overlay */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[30%] xl:w-[25%] px-4 sm:px-6 md:px-8 lg:px-6 xl:px-8 py-8 lg:py-0 min-h-screen">
        <div className="login-card">
          {React.createElement(ActiveComponent, {
            changeTab: setTab,
          })}
        </div>
      </div>
    </div>
  );
}
