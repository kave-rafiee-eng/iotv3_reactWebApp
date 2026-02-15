import { useEffect, useState } from "react";
import SimpleCharts from "./chart";
import SimpleLineChart from "./lineChart";
import axios from "axios";

import TableProp from "./tableProp";
import RecordInputs from "./select";

import Grid from "@mui/material/Grid";
import StickyHeadTable from "./stickyTable";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

function Home() {
  const [data, setData] = useState([]);

  const [formData, setFormData] = useState({
    value: 0,
  });

  const fetchData = async () => {
    try {
      const res = await api.get("/record/history");
      console.log(res.data);
      setData(res.data);
    } catch {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else {
        console.log("Error:" + err.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePostFrom = async (data) => {
    let postData = [];
    postData.push(data);

    try {
      const res = await api.post("/record/new", postData);
      console.log(res.data);
    } catch {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else {
        console.log("Error:" + err.message);
      }
    }

    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await api.post("/record/delete", { id: id });
      console.log(res.data);
    } catch {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else {
        console.log("Error:" + err.message);
      }
    }
    fetchData();
  };

  return (
    <div>
      <h3>Home</h3>

      <Grid container spacing={1} direction="column">
        <Grid container spacing={2}>
          <Grid item xs={3} sm={3} md={3}>
            <RecordInputs handlePostRecord={handlePostFrom} />
          </Grid>
          <Grid item xs={3} md={3}>
            <StickyHeadTable tableData={data} deleteId={handleDelete} />
          </Grid>
          <Grid item xs={3} md={3}>
            {
              //<TableProp tableData={data} deleteId={handleDelete} />
            }
          </Grid>
        </Grid>

        <Grid item xs={6} md={6}>
          <SimpleCharts chartData={data} />
        </Grid>

        <Grid item xs={6} md={6}>
          <SimpleLineChart chartData={data} />
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;

/*
  let now = new Date();
  let timestamp = now.getTime();

  console.log("timestamp" + timestamp);

  let iso = now.toISOString();
  console.log("iso : " + iso);

  let result = new Intl.DateTimeFormat("en-US-u-ca-persian", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);

  console.log(result);
  */
