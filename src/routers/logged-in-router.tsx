import React from "react";
import { Loading } from "../components/loading";
import { UserRole } from "../mytypes";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { ListenerPodcasts } from "../pages/listener/listener-podcasts";
import { Header } from "../components/header";
import { HostPodcasts } from "../pages/host/host-podcasts";
import { useMe } from "../hooks/useMe";
import { CreatePodcast } from "../pages/host/create-podcast";
import { DetailPodcast } from "../pages/detail-podcast";
import { EditProfile } from "../pages/edit-profile";
import { ConfirmEmail } from "../pages/confirm-email";
import { Search } from "../pages/listener/search";
import { CreateEpisode } from "../pages/host/create-episode";

const listenerRoutes = [
  {
    path: "/",
    component: <ListenerPodcasts />,
  },
  {
    path: "/search",
    component: <Search />,
  },
];

const hostRoutes = [
  { path: "/", component: <HostPodcasts /> },
  { path: "/create-podcast", component: <CreatePodcast /> },
  { path: "/podcast/create-episode", component: <CreateEpisode /> },
];

const commonRoutes = [
  { path: "/podcast/:id", component: <DetailPodcast /> },
  { path: "/confirm", component: <ConfirmEmail /> },
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  if (!data || loading || error) {
    return <Loading />;
  }
  return (
    <Router>
      <Header
        email={data.me.email}
        role={data.me.role}
        emailVerified={data.me.emailVerified}
      />
      <Routes>
        {data.me.role === UserRole.Listener &&
          listenerRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
            />
          ))}
        {data.me.role === UserRole.Host &&
          hostRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
            />
          ))}
        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
        <Route
          path="/edit-profile"
          element={<EditProfile email={data.me.email} id={data.me.id} />}
        />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
  );
};
