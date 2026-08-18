import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf,
} from "../services/interview.api";
import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

const getResumePdfErrorMessage = async (error) => {
  const fallbackMessage = "Failed to generate resume PDF. Please try again.";
  const responseData = error.response?.data;

  if (responseData instanceof Blob) {
    try {
      const text = await responseData.text();
      const parsed = JSON.parse(text);

      return parsed.message || fallbackMessage;
    } catch {
      return fallbackMessage;
    }
  }

  return responseData?.message || fallbackMessage;
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  const { interviewId } = useParams();

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    setLoading(true)

    try {
        const response = await generateInterviewReport({
            jobDescription,
            selfDescription,
            resumeFile
        })

        setReport(response.interviewReport)
        return response.interviewReport
    } catch (error) {
        console.error("Failed to generate interview report:", error)
        return null
    } finally {
        setLoading(false)
    }
}

  const getReportById = async (interviewId) => {
    setLoading(true);

    try {
      const response = await getInterviewReportById(interviewId);
      setReport(response.interviewReport);
      return response.interviewReport;
    } catch (error) {
      console.error("Failed to get interview report:", error);
      setReport(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getReports = async () => {
        setLoading(true)

        try {
            const response = await getAllInterviewReports()
            setReports(response.interviewReports || [])
            return response.interviewReports || []
        } catch (error) {
            console.error("Failed to get interview reports:", error)
            setReports([])
            return []
        } finally {
            setLoading(false)
        }
    }

  const getResumePdf = async (interviewReportId) => {
    setLoading(true);
    try {
      const { blob, filename } = await generateResumePdf({ interviewReportId });
      const pdfBlob =
        blob instanceof Blob ? blob : new Blob([blob], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");

      try {
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
      } finally {
        link.remove();
        window.URL.revokeObjectURL(url);
      }

      return true;
    } catch (error) {
      const message = await getResumePdfErrorMessage(error);

      console.error("Failed to download resume PDF:", error);
      window.alert(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReports();
    }
  }, [interviewId]);

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
    getResumePdf,
  };
};
