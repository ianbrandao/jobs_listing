import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Define the types for the request object
type JobsApiRequest = NextApiRequest & {
  query: {
    companySkills?: boolean;
    dismissedListingHashes?: string[];
    fetchJobDesc?: boolean;
    jobTitle?: string;
    locations?: string[];
    numJobs?: number;
    previousListingHashes?: string[];
  };
};

// Define the type for the response object
type JobsApiResponse = {
  success: boolean;
  message?: string;
  jobs: {
    jobId: number;
    jobTitle: string;
    companyName: string;
    jobDescription: string;
    postingDate: string;
    OBJurl: string;
  }[];
};

// Set the URL for the jobs API
const JOBS_API_URL = 'https://www.zippia.com/api/jobs/';

// Define the request handler function
export default async function handler(req: JobsApiRequest, res: NextApiResponse<JobsApiResponse>) {
  // Extract the query parameters from the request object
  const { companySkills, dismissedListingHashes, fetchJobDesc, jobTitle, locations, numJobs, previousListingHashes } = req.query;

  // Construct the payload object with default values for each parameter
  const payload = {
    companySkills: companySkills || true,
    dismissedListingHashes: dismissedListingHashes || [],
    fetchJobDesc: fetchJobDesc || true,
    jobTitle: jobTitle || 'Business Analyst',
    locations: locations || [],
    numJobs: numJobs || 20,
    previousListingHashes: previousListingHashes || [],
  };

  try {
    // Send a POST request to the jobs API with the payload
    const response = await axios.post(JOBS_API_URL, payload);

    // Extract the list of jobs from the response
    const jobs = response.data.jobs;

    // Send a JSON response with the list of jobs and a success flag
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    // Log any errors to the console
    console.error(error);

    // Send a JSON response with an error message and an empty list of jobs
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      jobs: [],
    });
  }
}
