import { Autocomplete, Button, TextField } from "@mui/material";
import { DatePicker } from "antd";
import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";
import logo from "../../assets/imgs/logo.png";
import qblogo from "../../assets/imgs/qbLogo.png";
import Cookies from "js-cookie";
import moment from "moment/moment";
import Rolls from "./Rolls";
import SlittedRolls from "./SlittedRolls";
import Tamburs from "./Tamburs";
import Pieces from "./Pieces";
import Productions from "./Productions";
import { AiFillPrinter } from "react-icons/ai";
import { CSVLink } from "react-csv";
import csvIcon from "../../assets/imgs/csv.png";

const Reports = () => {
  const { t } = useTranslation();
  const currentLanguageCode = Cookies.get("i18next") || "en";
  const componentRef = useRef();
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const [date, setDate] = useState("");
  const [year, setYear] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [speed, setSpeed] = useState("");
  const [technician, setTechniciant] = useState("");
  const [selected, setSelected] = useState(t("rolls"));
  const [url, setUrl] = useState("");
  const [line, setLine] = useState("");

  const lists = [
    { label: t("rolls"), id: "rolls" },
    { label: t("slitted_rolls"), id: "slit" },
    { label: t("pieces"), id: "pieces" },
    { label: t("tambur"), id: "tambur" },
    { label: t("productions"), id: "production" },
    { label: t("qandelblblas_store"), id: "qandelblbasstore" },
  ];
  const lines = [
    { label: t("all"), id: "" },
    { label: "101A", id: "101A" },
    { label: "76B", id: "76B" },
    { label: "76C", id: "76C" },
    { label: "51D", id: "51D" },
  ];

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  useEffect(() => {
    let u = url;
    setUrl("");
    setUrl(u);
  }, [date, year, line]);
  return (
    <div>
      <Row className="mb-3 px-md-5">
        <Col md={4} className="mb-2">
          <Autocomplete
            style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
            isOptionEqualToValue={(option, value) => option.url === value.url}
            disablePortal
            size="small" 
            id="combo-box-demo"
            name="selectedList"
            label={t("report_list")}
            options={lists}
            onChange={(event, newValue) => {
              setCsvData([]);
              setHeaders([]);
              if (newValue?.id) {
                setSelected(newValue.label);
                setUrl(newValue.id);
              } else {
                setSelected("...");
                setUrl("");
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label={<em>{t("report_list")}</em>} />
            )}
          />
        </Col>
        <Col xs={6} md={2}>
          <DatePicker
            picker="year"
            size="large"
            placeholder={t("year")}
            disabled={date}
            onChange={(date, dateString) => {
              setYear(dateString);
            }}
            style={{
              width: "100%",
              boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            }}
          />
        </Col>
        <Col xs={6} md={2}>
          <DatePicker
            size="large"
            placeholder={t("date")}
            disabled={year}
            onChange={(date, dateString) => {
              setDate(dateString);
            }}
            style={{
              width: "100%",
              boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            }}
          />
        </Col>
        <Col md={3} className="mt-2 m-md-0">
          <Autocomplete
            style={{
              width: "100%",
              boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            }}
            disablePortal
            size="small"
            id="combo-box-demo"
            name="selectedList"
            label={t("line")}
            options={lines}
            disabled={!(url == "tambur" || url == "production")}
            onChange={(event, newValue) => {
              if (newValue?.id) {
                setLine(newValue?.id);
              } else {
                setLine("");
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label={<em>{t("line")}</em>} />
            )}
          />
        </Col>
      </Row>
      <Row className="px-0 px-md-5">
        <Col md={2}>
          <Button
            variant="outlined"
            disabled={!url}
            onClick={() => {
              handlePrint();
            }}
          >
            <span className={currentLanguageCode == "en" ? "en-f" : "kr-f"}>
              <AiFillPrinter /> {t("print")}
            </span>
          </Button>
        </Col>
        <Col
          md={2}
          className={`d-flex align-items-center ${url == "slit" && "d-none"}`}
        >
          <CSVLink
            className="csv-btn"
            data={csvData}
            headers={headers}
            disabled={!csvData.length}
            filename={`${selected}-report(${
              date || moment().format("Y-MM-DD")
            })`}
          >
            <img src={csvIcon} className="img-fluid csv-icon px-2" alt="" />
            .csv
          </CSVLink>
        </Col>
      </Row>
      <Row>
        <Col
          md={{ order: 1, span: 9 }}
          xs={{ order: 2 }}
          className="p-0 report-font"
        >
          <div className="px-md-4 mt-4 ">
            <div
              ref={componentRef}
              style={{
                width: "100%",
                height: "100%",
              }}
              className={currentLanguageCode == "en" ? "ltr" : "rtl"}
            >
              <div className="d-flex justify-content-between align-items-end mb-2">
                <div className="r-start">
                  <img src={logo} className="img-fluid report-img-bb" alt="" />
                </div>
                <div
                  className={`text-center r-title ${
                    currentLanguageCode == "en" ? " r-title-en" : "r-title-kr"
                  }`}
                >
                  <h5 className="m-0">
                    {t("Report_of")} ({selected})
                  </h5>
                  <div className="mt-1">
                    {date ? (
                      <h6>{date}</h6>
                    ) : year ? (
                      <h6>{year}</h6>
                    ) : (
                      <h6>{moment().format("Y-MM-DD")}</h6>
                    )}
                  </div>
                </div>
                <div
                  className={`r-end ${
                    currentLanguageCode == "en" ? "text-end" : "text-start"
                  }`}
                >
                  <img
                    src={qblogo}
                    className="img-fluid report-img-qb"
                    alt=""
                  />
                </div>
              </div>
              {url == "production" || url == "tambur" ? (
                <Container fluid>
                  <Row className="report_header pt-2 pb-3">
                    <Col xs={1} className="p-0"></Col>
                    <Col xs={3} className="p-0 d-flex justify-content-between">
                      <div className="">
                        <span>{t("technician")}</span>
                        <br />
                        <span>{t("date")}</span>
                        <br />
                        <span>{t("from_time")}</span>
                        <br />
                      </div>
                      <div className="">
                        <span>:</span>
                        <br />
                        <span>:</span>
                        <br />
                        <span>:</span>
                        <br />
                      </div>
                      <div className="">
                        <span>{technician}</span>
                        <br />
                        <span>{moment().format("Y.MM.DD")}</span>
                        <br />
                        <span>{fromTime}</span>
                        <br />
                      </div>
                    </Col>
                    <Col xs={4} className="p-0"></Col>
                    <Col xs={3} className="p-0 d-flex justify-content-between">
                      <div className="">
                        <span>{t("line")}</span>
                        <br />
                        <span>{t("speed")}</span>
                        <br />
                        <span>{t("to_time")}</span>
                        <br />
                      </div>
                      <div className="">
                        <span>:</span>
                        <br />
                        <span>:</span>
                        <br />
                        <span>:</span>
                        <br />
                      </div>
                      <div className="">
                        <span>{line}</span>
                        <br />
                        <span>{speed}</span>
                        <br />
                        <span>{toTime}</span>
                        <br />
                      </div>
                    </Col>
                    <Col xs={1} className="p-0"></Col>
                  </Row>
                </Container>
              ) : (
                <></>
              )}
              <img alt={""} src={logo} className={"watermark"} />
              <div
                style={{ overflow: "auto" }}
                className={`w-100 ${
                  currentLanguageCode == "en"
                    ? "report-table pg-break-en"
                    : "report-table pg-break-kr"
                }`}
              >
                {url == "rolls" ? (
                  <Rolls
                    setCsvData={setCsvData}
                    setHeaders={setHeaders}
                    date={date}
                    year={year}
                  />
                ) : (
                  <></>
                )}
                {url == "slit" ? (
                  <SlittedRolls date={date} year={year} />
                ) : (
                  <></>
                )}
                {url == "pieces" ? (
                  <Pieces
                    setCsvData={setCsvData}
                    setHeaders={setHeaders}
                    date={date}
                    year={year}
                  />
                ) : (
                  <></>
                )}
                {url == "tambur" ? (
                  <Tamburs
                    setCsvData={setCsvData}
                    setHeaders={setHeaders}
                    csv={true}
                    date={date}
                    year={year}
                    line={line}
                  />
                ) : (
                  <></>
                )}
                {url == "production" || url == "qandelblbasstore" ? (
                  <>
                    <Productions
                      setCsvData={setCsvData}
                      setHeaders={setHeaders}
                      date={date}
                      year={year}
                      url={url}
                      line={line}
                    />
                    {url == "production" ? (
                      <div className="pagebreak">
                        <h5 className="mt-4">{t("tambur")}</h5>
                        <Tamburs
                          setCsvData={setCsvData}
                          setHeaders={setHeaders}
                          csv={false}
                          date={date}
                          year={year}
                          line={line}
                        />
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </Col>
        <Col md={3} xs={{ order: 1 }} className="report_form px-0 ">
          <div className="report_form_box">
            <h5 className="mb-0">{t("report_form")}</h5>
            <hr className="mt-1" />
            <div className="px-3">
              <TextField
                className="mb-4 w-100"
                id="standard-basic"
                label={t("technician")}
                variant="standard"
                size="small"
                onChange={(event) => {
                  setTechniciant(event.target.value);
                }}
              />
              <TextField
                className="mb-3 w-100"
                id="time"
                label={t("from_time")}
                variant="standard"
                type="time"
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(newValue) => {
                  setFromTime(newValue.target.value);
                }}
              />
              <TextField
                className="mb-3 w-100"
                id="time"
                label={t("to_time")}
                variant="standard"
                type="time"
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(newValue) => {
                  setToTime(newValue.target.value);
                }}
              />
              <TextField
                className="mb-3 w-100"
                id="standard-basic"
                label={t("speed")}
                variant="standard"
                size="small"
                onChange={(event) => {
                  setSpeed(event.target.value);
                }}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;
