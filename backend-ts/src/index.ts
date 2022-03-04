import createServer from './server';

const server = createServer();

server.listen(process.env.EXPRESS_LISTEN_PORT, async () => {
  console.log(`Server started at http://localhost:${process.env.EXPRESS_LISTEN_PORT}`);
});
