import React from 'react';
import styled from 'styled-components';
import NavFrontendSpinner from 'nav-frontend-spinner';

const SpinnerElement = styled.span`
    width: 0.75rem;
    height: 0.75rem;
    margin: auto;
    display: inline-block;
    vertical-align: top;

    svg {
        width: 100%;
        height: 100%;
        vertical-align: top;
    }
`;

const Spinner = () => (
    <SpinnerElement>
        <NavFrontendSpinner />
    </SpinnerElement>
);

export {SpinnerElement};
export default Spinner;
