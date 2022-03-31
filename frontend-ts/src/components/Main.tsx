import styled from '@emotion/styled';

const Main = styled.main`
  background: ${p => p.theme.gray100};
  margin: 3rem auto;
  max-width: 500px;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 2px 2px 8px ${p => p.theme.purple200};
  ul {
    padding-left: 2rem;
    li {
      margin: 0.5rem 0;
    }
  }
  hr {
    color: ${p => p.theme.purple200};
  }
  h3 {
    margin-top: 0;
  }
  button {
    display: block;
    margin: 0 auto;
  }
`;

export default Main;
