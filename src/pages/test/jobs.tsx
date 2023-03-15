import { useState } from "react";
import axios from "axios";
import { GetServerSideProps } from "next";
import styled from "styled-components";

type Job = {
  jobId: number;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  postingDate: string;
  OBJurl: string;
};

type JobsProps = {
  jobs: Job[];
};

type JobsApiPayload = {
  companySkills?: boolean;
  dismissedListingHashes?: string[];
  fetchJobDesc?: boolean;
  jobTitle?: string;
  locations?: string[];
  numJobs?: number;
  previousListingHashes?: string[];
};

const Container = styled.div`
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  font-family: 'Roboto';

  @media (min-width: 768px) {
    max-width: 768px;
  }

  @media (min-width: 992px) {
    max-width: 992px;
  }

  @media (min-width: 1200px) {
    max-width: 1200px;
  }
`;

const Title = styled.h1`
  margin: 10px 0;
  font-size: 28px;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 20px 0px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Button = styled.button`
  background-color: #fff;
  border: 2px solid #00509a;
  color: #3071c0;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-right: 10px;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 5px;
  font-weight: bold;

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 10px;
  }

  :hover,
  :focus {
    color: #fff;
    background-color: #3071c0;
  }
`;

const JobsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const JobCard = styled.li`
  margin: 15px 0;
  padding: 20px 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  box-shadow: 0 15px 20px -19px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: 0.3s;

  @media (max-width: 768px) {
    padding: 20px 10px;
    flex-direction: column;
  }

  :hover {
    background-color: #f7f8f9;
  }

  :hover h2 {
    color: #3071c0;
  }
`;

const JobTitleCompany = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 30%;
  margin-right: 2%;

  @media (max-width: 768px) {
    width: 100%;
    margin: 10px 0;
  }
`;

const JobTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  width: 100%;
  text-align: center;
  color: #333;

  @media (max-width: 768px) {
    font-size: 20px;
    width: 100%;
  }
`;

const JobCompany = styled.h3`
  margin: 10px 0;
  font-size: 18px;
  width: 100%;
  text-align: center;
  color: #333;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 16px;
    width: 100%;
  }
`;

const JobDescription = styled.p`
  margin: 0;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  width: 70%;
  text-align: justify;
  color: #333;

  @media (max-width: 768px) {
    font-size: 14px;
    width: 100%;
  }
`;

const Jobs = ({ jobs }: JobsProps) => {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs.slice(0, 10));
  const [sortedByCompany, setSortedByCompany] = useState(false);

  const handleFilterByRecent = () => {
    const filtered = jobs.filter((job) => {
      const today = new Date();
      const jobDate = new Date(job.postingDate);
      const diffDays = Math.ceil(
        (today.getTime() - jobDate.getTime()) / (1000 * 3600 * 24)
      );
      return diffDays <= 7;
    });
    setFilteredJobs(filtered);
    setSortedByCompany(false);
  };

  const handleSortByCompany = () => {
    if (!sortedByCompany) {
      const sorted = jobs
        .slice()
        .sort((a, b) => a.companyName.localeCompare(b.companyName));
      setFilteredJobs(sorted);
      setSortedByCompany(true);
    } else {
      setFilteredJobs(jobs.slice());
      setSortedByCompany(false);
    }
  };

  const handleResetFilters = () => {
    setFilteredJobs(jobs.slice(0, 10));
    setSortedByCompany(false);
  };

  const openLink = (link: string) => {
    window.open(link, '_blank');
  };

  return (
    <Container>
      <Title>Jobs Listing</Title>
      <ButtonContainer>
        <Button onClick={handleResetFilters}>Reset Filters</Button>
        <Button onClick={() => handleFilterByRecent()}>Filter by Recent</Button>
        <Button onClick={() => handleSortByCompany()}>
          {sortedByCompany ? "Sort by Posting Date" : "Sort by Company"}
        </Button>
      </ButtonContainer>
      <JobsList>
        {filteredJobs.map((job) => (
          <JobCard
            key={job.jobId}
            onClick={() => openLink(job.OBJurl)}
          >
            <JobTitleCompany>
              <JobTitle>{job.jobTitle}</JobTitle>
              <JobCompany>{job.companyName}</JobCompany>
            </JobTitleCompany>
            <JobDescription>{job.jobDescription.replace(/(<([^>]+)>)/gi, "")}</JobDescription>
          </JobCard>
        ))}
      </JobsList>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<JobsProps> = async () => {
  const payload: JobsApiPayload = {
    companySkills: true,
    dismissedListingHashes: [],
    fetchJobDesc: true,
    jobTitle: "Business Analyst",
    locations: [],
    numJobs: 20,
    previousListingHashes: [],
  };

  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_URL + "/api/jobs",
      payload
    );
    const jobs = response.data.jobs;

    return { props: { jobs } };
  } catch (error) {
    console.error(error);

    return { props: { jobs: [] } };
  }
};

export default Jobs;