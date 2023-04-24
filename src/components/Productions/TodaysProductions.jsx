import { Space, Spin, Table, Input, DatePicker } from "antd";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const { Search } = Input;

const TodaysProductions = ({
  fStoreDataLength,
  setSearch,
  fStoreColumn,
  loading,
  setLimit,
  setCurrentPage,
  count,
  limit,
  setDate,
  fStoreData,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <Row className="mt-4">
        <Col md={6}>
          <h4 className="mb-3">
            {t("productions")} ({fStoreDataLength}){" "}
          </h4>
        </Col>
        <Col md={2}>
          <DatePicker
            placeholder={t("date")}
            className="my-1 my-md-2"
            onChange={(date, dateString) => {
              setDate(dateString);
            }}
          />
        </Col>
        <Col md={4}>
          <Search
            placeholder={t("search")}
            allowClear
            enterButton
            className="my-1 my-md-2"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </Col>
      </Row>
      <Table
        columns={fStoreColumn}
        size="small"
        className="tbs"
        id="rollsTable"
        rowKey="id"
        loading={{
          indicator: (
            <Space size="middle">
              <Spin size="large" />
            </Space>
          ),
          spinning: loading,
        }}
        pagination={{
          onChange: (current, size) => {
            setLimit(size);
            setCurrentPage(current);
          },
          total: Math.floor(count * limit),
          defaultPageSize: limit,
          showSizeChanger: true,
          pageSizeOptions: ["10","25", "50", "100"],
        }}
        expandable={{
          expandedRowRender: (record) => (
            <>
              <div className="px-md-4">
                <span className=" lh-base">{t("code")}: </span>
                <span className="fw-bold">{record.productCode}</span>
                <br />
                <span className=" lh-base">{t("comment")}: </span>
                <span className="fw-bold">{record.p_comment}</span>
                <br />
              </div>
            </>
          ),
          columnWidth: 12,
        }}
        dataSource={fStoreData}
      />
    </>
  );
};

export default TodaysProductions;
