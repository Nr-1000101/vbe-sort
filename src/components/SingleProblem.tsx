import { Accordion, Button } from "react-bootstrap";
import {
  SubjectType,
  appendToMakerListUrl,
  isNotHaveAnswersMathPupp,
  isNotHaveAnswersMathVbe,
  parseProblemFilename,
  removeFromListUrl,
} from "../misc";
import "./style.css";
import { useEffect, useState } from "react";

export default function SingleProblem({
  filename,
  subject,
  answerLut,
  theListItIs = false,
  listUrl,
  setListUrl,
}: {
  filename: string;
  subject: SubjectType;
  answerLut: { filename: string; topic: string; answer?: string }[];
  theListItIs?: boolean;
  listUrl?: string;
  setListUrl?: (url: string) => void;
}) {
  const problemInfo: any = parseProblemFilename(subject, filename);

  // ListMaker for Math VBE

  const [isAdded, setIsAdded] = useState(
    listUrl?.includes(filename.slice(0, -4)) || false
  );

  useEffect(() => {
    if (isAdded) {
      setListUrl?.(
        appendToMakerListUrl(filename.slice(0, -4), listUrl ? listUrl : "")
      );
    } else {
      setListUrl?.(
        removeFromListUrl(filename.slice(0, -4), listUrl ? listUrl : "")
      );
    }
  }, [isAdded]);

  return (
    <>
      <div
        style={{
          paddingTop: "30px",
          paddingBottom: "30px",
          overflowX: "auto",
        }}
        className="single-problem"
      >
        <img
          loading="lazy"
          alt={filename}
          src={`${subject}-problems/${problemInfo.year.substring(
            0,
            4
          )}/${filename}`}
          style={{
            width: "auto",
            height: "auto",
            maxWidth: "900px",
          }}
        />
      </div>
      {!theListItIs &&
        subject === "math" &&
        problemInfo.problemType !== "root" && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {!isAdded && (
              <Button variant="warning" onClick={() => setIsAdded(!isAdded)}>
                Pridėti į sąrašą
              </Button>
            )}
            {isAdded && (
              <div>
                <Button
                  variant="outline-danger"
                  onClick={() => setIsAdded(!isAdded)}
                  style={{ marginRight: "10px" }}
                >
                  Išimti iš sąrašo
                </Button>
                <Button variant="success" disabled>
                  <strong>
                    <em>Pridėta</em>
                  </strong>
                </Button>
              </div>
            )}
          </div>
        )}

      <div>
        {!["root", "sources"].includes(problemInfo.problemType) &&
          !(subject === "math" && isNotHaveAnswersMathVbe(problemInfo.year)) &&
          !(
            subject === "pupp" && isNotHaveAnswersMathPupp(problemInfo.year)
          ) && (
            <Accordion style={{ marginTop: "20px" }}>
              <Accordion.Item eventKey="answer">
                <Accordion.Header className="root-header">
                  Atsakymas
                </Accordion.Header>
                <Accordion.Body>
                  {problemInfo.section === "I" ? (
                    <h3>
                      {
                        answerLut.find(
                          (problem) => problem.filename === filename
                        )?.answer
                      }
                    </h3>
                  ) : (
                    <div
                      className="single-problem"
                      style={{
                        overflowX: "auto",
                      }}
                    >
                      <img
                        loading="lazy"
                        alt={`${
                          answerLut.find(
                            (problem) => problem.filename === filename
                          )?.answer
                        }`}
                        src={`${subject}-answers/${
                          answerLut.find(
                            (problem) => problem.filename === filename
                          )?.answer
                        }`}
                        style={{
                          width: "auto",
                          height: "auto",
                          maxWidth: "900px",
                          overflowX: "auto",
                        }}
                      />
                    </div>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          )}
      </div>
    </>
  );
}
