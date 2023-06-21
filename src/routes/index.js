import ProtectedRoute from "components/ProtectedRoutes";
import Home from "pages/Home";
import Login from "pages/Login";
import Profile from "pages/Profile";
import Register from "pages/Register";

const routes = [
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>
    }
];

export default routes;
