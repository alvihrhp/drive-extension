import React, { useState, useCallback, useEffect } from "react";
import logo from "./logo.svg";
import "./global.css";
/** Screens */
import { Login, Manage } from "./screens";
/** Helper */
import { Storage, fetchHelper } from "./helper";
/** React Router */
import { Routes, Route } from "react-router-dom";
/** Sentry */
import * as Sentry from "@sentry/react";

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

interface Props {}

const App: React.FC<Props> = () => {
  return (
    <SentryRoutes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/manage" element={<Manage />}></Route>
    </SentryRoutes>
  );
};

export default Sentry.withProfiler(App);
