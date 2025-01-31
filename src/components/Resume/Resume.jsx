import React, { forwardRef, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AtSign,
  Calendar,
  GitHub,
  Linkedin,
  MapPin,
  Paperclip,
  Phone,
} from "react-feather";
import styles from "./Resume.module.css";

const Resume = forwardRef((props, ref) => {
  const information = props.information;
  const sections = props.sections;
  const containerRef = useRef();

  const [columns, setColumns] = useState([[], []]);
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");

  const info = {
    workExp: information[sections.workExp],
    project: information[sections.project],
    achievement: information[sections.achievement],
    education: information[sections.education],
    basicInfo: information[sections.basicInfo],
    summary: information[sections.summary],
    other: information[sections.other],
  };

  const getFormattedDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const sectionDiv = Object.keys(info).reduce((acc, key) => {
    const sectionData = info[key];
    if (!sectionData) return acc;

    acc[sections[key]] = (
      <motion.div
        key={key}
        draggable
        onDragOver={() => setTarget(sectionData?.id)}
        onDragEnd={() => setSource(sectionData?.id)}
        className={`${styles.section} ${
          sectionData?.sectionTitle ? "" : styles.hidden
        }`}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        whileHover={{ scale: 1.02 }}
      >
        <div className={styles.sectionTitle}>{sectionData.sectionTitle}</div>
        <div className={styles.content}>
          {sectionData.details?.map((item, index) => (
            <motion.div
              key={index}
              className={styles.item}
              whileHover={{ scale: 1.02 }}
            >
              {item.title && <p className={styles.title}>{item.title}</p>}
              {item.companyName && (
                <p className={styles.subTitle}>{item.companyName}</p>
              )}
              {item.certificationLink && (
                <a className={styles.link} href={item.certificationLink}>
                  <Paperclip /> {item.certificationLink}
                </a>
              )}
              {item.startDate && item.endDate && (
                <div className={styles.date}>
                  <Calendar /> {getFormattedDate(item.startDate)} -{" "}
                  {getFormattedDate(item.endDate)}
                </div>
              )}
              {item.points?.length > 0 && (
                <ul className={styles.points}>
                  {item.points.map((elem, i) => (
                    <li key={i} className={styles.point}>
                      {elem}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
    return acc;
  }, {});

  useEffect(() => {
    setColumns([
      [sections.project, sections.education, sections.summary],
      [sections.workExp, sections.achievement, sections.other],
    ]);
  }, []);

  useEffect(() => {
    if (!source || !target) return;
    const tempColumns = [...columns];
    const sourceIndex = tempColumns.flat().indexOf(source);
    const targetIndex = tempColumns.flat().indexOf(target);
    if (sourceIndex === -1 || targetIndex === -1) return;
    tempColumns.flat()[sourceIndex] = target;
    tempColumns.flat()[targetIndex] = source;
    setColumns(tempColumns);
  }, [source]);

  useEffect(() => {
    if (!props.activeColor || !containerRef.current) return;
    containerRef.current.style.setProperty("--color", props.activeColor);
  }, [props.activeColor]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div ref={containerRef} className={styles.container}>
        <motion.div
          className={styles.header}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <p className={styles.heading}>{info.basicInfo?.detail?.name}</p>
          <p className={styles.subHeading}>{info.basicInfo?.detail?.title}</p>
          <div className={styles.links}>
            {info.basicInfo?.detail?.email && (
              <a className={styles.link}>
                <AtSign /> {info.basicInfo?.detail?.email}
              </a>
            )}
            {info.basicInfo?.detail?.phone && (
              <a className={styles.link}>
                <Phone /> {info.basicInfo?.detail?.phone}
              </a>
            )}
            {info.basicInfo?.detail?.linkedin && (
              <a className={styles.link}>
                <Linkedin /> {info.basicInfo?.detail?.linkedin}
              </a>
            )}
            {info.basicInfo?.detail?.github && (
              <a className={styles.link}>
                <GitHub /> {info.basicInfo?.detail?.github}
              </a>
            )}
          </div>
        </motion.div>

        <div className={styles.main}>
          <motion.div
            className={styles.col1}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            {columns[0].map((item) => sectionDiv[item])}
          </motion.div>
          <motion.div
            className={styles.col2}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            {columns[1].map((item) => sectionDiv[item])}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
});

export default Resume;
