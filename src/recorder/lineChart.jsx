import * as React from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { LineChart } from "@mui/x-charts/LineChart";

const margin = { right: 24 };
const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  "Page A",
  "Page B",
  "Page C",
  "Page D",
  "Page E",
  "Page F",
  "Page G",
];

const highlightScope = {
  highlight: "item",
  fade: "global",
};

function CustomLine(props) {
  const { d, ownerState, className, ...other } = props;

  return (
    <React.Fragment>
      <path
        d={d}
        stroke={
          ownerState.gradientId
            ? `url(#${ownerState.gradientId})`
            : ownerState.color
        }
        strokeWidth={ownerState.isHighlighted ? 4 : 2}
        strokeLinejoin="round"
        fill="none"
        filter={ownerState.isHighlighted ? "brightness(120%)" : undefined}
        opacity={ownerState.isFaded ? 0.3 : 1}
        className={className}
      />
      <path
        d={d}
        stroke="transparent"
        strokeWidth={25}
        fill="none"
        className="interaction-area"
        {...other}
      />
    </React.Fragment>
  );
}

export default function SimpleLineChart({ chartData }) {
  const [showInteractionArea, setShowInteractionArea] = React.useState(true);

  //------------------

  let allDates = [];
  let allValues = [];

  let dateNow = new Date();

  for (let i = 7; i >= 0; i--) {
    let currentDate = dateNow.getTime() - i * 24 * 60 * 60 * 1000;
    allDates.push(
      new Date(currentDate).toLocaleDateString("fa-IR-u-ca-persian"),
    );
  }

  allDates.forEach((dateString) => {
    let findedData = chartData.find(
      (data) =>
        new Date(data.Date).toLocaleDateString("fa-IR-u-ca-persian") ===
        dateString,
    );

    if (findedData) allValues.push(findedData.value);
    else allValues.push(0);
  });

  const settings = {
    height: 300,
    series: [{ data: allValues, label: "value", highlightScope }],
    xAxis: [{ scaleType: "point", data: allDates }],
    yAxis: [{ width: 50 }],
    margin,
  };

  return (
    <Box
      sx={{
        width: "100%",
        "& .interaction-area": showInteractionArea
          ? {
              stroke: "lightgray",
              strokeOpacity: 0.3,
            }
          : {},
      }}
    >
      <FormControlLabel
        checked={showInteractionArea}
        control={
          <Checkbox
            onChange={(event) => setShowInteractionArea(event.target.checked)}
          />
        }
        label="Show highlight area"
        labelPlacement="end"
      />
      <LineChart {...settings} slots={{ line: CustomLine }} />
    </Box>
  );
}
