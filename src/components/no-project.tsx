import { FC } from "hono/jsx";
import Layout from "./layout";

const NoProject: FC = (props) => {
  return (
    <Layout>
      <h1 className="text-4xl font-light text-center mb-4 flex justify-center items-center h-[90vh]">
        Error: Project is required
      </h1>
    </Layout>
  );
};

export default NoProject;
