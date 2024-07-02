import { GetServerSideProps, NextPage } from "next";

export type TestPageProps = {
    message: string;
}

const populateProps = () => {
    return {
        message: "Hello from props"
    }
}

const TestPage = () => {

    const props = populateProps();
    
    return (
        <h1>{props.message}</h1>
    )
} 

export default TestPage;