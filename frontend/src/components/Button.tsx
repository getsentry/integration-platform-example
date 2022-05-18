import styled from '@emotion/styled';

const Button = styled.button`
  outline: 0;
  padding: 0.5rem 1rem;
  border: 0;
  border-radius: 1000px;
  margin: 0 0.5rem;
  background: ${p => p.theme.gray200};
  font-family: inherit;
  cursor: pointer;
  &.primary {
    background: ${p => p.theme.blue300};
    font-weight: bold;
    color: ${p => p.theme.surface100};
  }
`;

export default Button;
