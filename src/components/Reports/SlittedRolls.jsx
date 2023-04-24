import { Space, Spin } from "antd";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { HTTP } from "../../HTTPS";
import { useAuth } from "../auth";

const SlittedRolls = ({ date, year }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [allData, setAllData] = useState([]);
  const [piecesData, setPiecesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getEachPiece = async () => {
    setLoading(true);
    await HTTP.get(`/pieces/all?_date=${date}&_year=${year}&_deleted=${true}`)
      .then((response) => {
        setLoading(false);
        setPiecesData(response.data.rows);
      })
      .catch((error) => {
        setLoading(false);
        setPiecesData([]);
        if (error.response.status == 401) {
          auth.logout();
        } else if (error.response.status === 404) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: `${t("Data_Not_Found")}`,
            showConfirmButton: false,
            timer: 1500,
          });
        } else alert("Somthing is wrong, Please try again later");
      });
  };
  const getSlittedRolls = async () => {
    setLoading(true);
    if (!date) {
      if (!year) {
        date = moment().format("Y-MM-DD");
      }
    }
    await HTTP.get(`/slit/all?_date=${date}&_year=${year}`)
      .then((response) => {
        setAllData(response.data.rows);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setAllData([]);
        if (error.response.status == 401) {
          auth.logout();
        } else if (error.response.status === 404) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: `${t("Data_Not_Found")}`,
            showConfirmButton: false,
            timer: 1500,
          });
        } else alert("Somthing is wrong, Please try again later");
      });
  };
  useEffect(() => {
    getSlittedRolls();
    getEachPiece();
  }, [date, year]);
  return (
    <>
      {!loading ? (
        <>
          {allData.length && piecesData.length ? (
            <>
              <div className="">
                {t("total")} ({allData.length})
              </div>
              {allData.map((all, index) => {
                var i = 0;
                return (
                  <Container fluid key={all.id} className="pagebreak ">
                    <Row className="report_header pt-2 pb-3">
                      <Col xs={1} className="p-0"></Col>
                      <Col
                        xs={3}
                        className="p-0 d-flex justify-content-between"
                      >
                        <div className="">
                          <span>{t("technician")}</span>
                          <br />
                          <span>{t("size")}</span>
                          <br />
                          <span>{t("weight")}</span>
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
                          <span>{all.slittedBy}</span>
                          <br />
                          <span>
                            {all.width} * {all.thikness}
                          </span>
                          <br />
                          <span>{all.netWeight}</span>
                        </div>
                      </Col>
                      <Col xs={4} className="p-0"></Col>
                      <Col
                        xs={3}
                        className="p-0 d-flex justify-content-between"
                      >
                        <div className="">
                          <span>{t("date")}</span>
                          <br />
                          <span>{t("time")}</span>
                          <br />
                          <span>{t("code")}</span>
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
                          <span>{moment(all.createdAt).format("Y.MM.DD")}</span>
                          <br />
                          <span>{moment(all.createdAt).format("HH:mm")}</span>
                          <br />
                          <span>{all.code}</span>
                          <br />
                        </div>
                      </Col>
                      <Col xs={1} className="p-0"></Col>
                    </Row>
                    <Row className="px-2 mb-4">
                      <Table bordered className="report_table">
                        <thead className="table-light">
                          <tr className="nastedTable">
                            <th>{t("#")}</th>
                            <th>{t("width")}</th>
                            <th>{t("code")}</th>
                            <th>{t("weight")}</th>
                            <th>{t("actual_weight")}</th>
                            <th>{t("comment")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {piecesData.map((p) => {
                            if (all.rollId == p.rollId) {
                              i++;
                              return (
                                <>
                                  <tr key={all.id + index}>
                                    <td>{i}</td>
                                    <td>{p.width}</td>
                                    <td>{p.autoCode}</td>
                                    <td>{p.weight}</td>
                                    <td>{p.realWeight}</td>
                                    <td>{p.pieceComment}</td>
                                  </tr>
                                </>
                              );
                            }
                          })}
                        </tbody>
                      </Table>
                    </Row>
                  </Container>
                );
              })}
            </>
          ) : (
            <h5 className="text-center my-3 text-danger">Empty...</h5>
          )}
        </>
      ) : (
        <Space size="middle">
          <Spin size="large" />
        </Space>
      )}
    </>
  );
};

export default SlittedRolls;
