import styled from 'styled-components';

const AriaLabelElement = styled.span`
    position: absolute;
    top: auto;
    overflow: hidden;
    clip: rect(1px 1px 1px 1px); /* IE 6/7 */
    clip: rect(1px, 1px, 1px, 1px);
    width: 1px;
    height: 1px;
    white-space: nowrap;
`;

export default AriaLabelElement;
