import { Form, Formik } from "formik";
import React from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const BulkTambur = ({ initialValues }) => {
  const { t } = useTranslation();
  return (
    <Formik
      initialValues={initialValues}
      //   validationSchema={validationSchema}
      //   onSubmit={handleUpdate}
      validateOnMount
    >
      {(formik) => (
        <Form className="w-100 p-2">
          {console.log(formik.values)}
          <Modal.Body className="bulktamburform">
            Date
            {initialValues.map((d) => {
              return (
                <div key={d.id}>
                  <div className="d-flex infos">
                    <div>
                      {t("code")}: <span>{d.autoCode}</span>
                    </div>
                    <div>
                      {t("weight")}: <span>{d.weight} {t("kg")}</span>
                    </div>
                    <div>
                      {t("thikness")}: <span>{d.thikness} {t("mm")}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </Modal.Body>
        </Form>
      )}
    </Formik>
  );
};

export default BulkTambur;
