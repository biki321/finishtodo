import { ReactElement } from "react";
import CreateProject from "../components/CreateProject";
import Layout from "../components/Layout";
import NextPageWithLayout from "../types/NextPageWithLayout ";

const Today: NextPageWithLayout = () => {
  return (
    <div>
      <h1>app</h1>
      <CreateProject>
        <div> click</div>
      </CreateProject>
    </div>
  );
};

Today.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Today;
