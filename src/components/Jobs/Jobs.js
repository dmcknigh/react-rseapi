import React, { useState, useEffect } from "react";
import classes from "./Jobs.module.css";
import JobsTree from "./JobsTree";
import JobView from "./JobView";
import Card from "../Layout/Card";

const Jobs = (props) => {
  const [selectedJobName, setSelectedJobName] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedJobFileId, setSelectedJobFileId] = useState("");
  const [fullEdit, setFullEdit] = useState(false);

  useEffect(() => {
    if (props.qpath) {
      let qpath = props.qpath.replace("_", ":").replace("_", "/");

      console.log("qpath=" + qpath);
      jobFileSelected(qpath);
    }
  }, [props.qpath]);

  const jobFileSelected = (jobSpoolKey) => {
    console.log("spool key=" + jobSpoolKey);
    const [jobKey, spoolId] = jobSpoolKey.split("/");
    const [jobName, jobId] = jobKey.split(":");

    setSelectedJobName(jobName);
    setSelectedJobId(jobId);
    setSelectedJobFileId(spoolId);
  };

  const onToggleFullEdit = () => {
    setFullEdit(!fullEdit);
  };

  const layoutStyle = fullEdit
    ? {}
    : { display: "grid", gridTemplateColumns: "1fr 2fr" };

  return (
    <section className={classes.form}>
      <h1>JES Jobs</h1>
      <div style={layoutStyle}>
        {!fullEdit && (
          <Card>
            <JobsTree onJobFileSelected={jobFileSelected} />
          </Card>
        )}
        <JobView
          jobName={selectedJobName}
          jobId={selectedJobId}
          jobFileId={selectedJobFileId}
          onToggleFullEdit={onToggleFullEdit}
        />
      </div>
    </section>
  );
};

export default Jobs;
