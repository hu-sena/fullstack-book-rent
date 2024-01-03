import { Redirect } from 'react-react-dom';
import { useOktaAuth } from '@okta/okta-react';
import { SpinnerLoading } from '../Layouts/Utils/SpinnerLoading';

const LoginWidget = ({ config }) => {
    const { oktaAuth, authState } = useOktaAuth();

    const onSuccess = (tokens) => {
        oktaAuth.handleLoginRedirect(tokens);
    }

    const onError = (error) => {
        console.log('Sign in error: ', error);
    }

    if (!authState) {
        return (<SpinnerLoading />)
    }

    return authState.isAuthenticated ?
        <Redirect to={{ pathname: '/' }} />
        :
        <div></div>
}

export default LoginWidget;