import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaChevronDown, FaChevronUp, FaLinkedin } from 'react-icons/fa';
import TahsinImage from '../image/1.jpg';
import TamimImage from '../image/2.jpg';
import AuloyImage from '../image/3.jpg';
import SonodImage from '../image/4.jpg';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const lineFadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const AboutPage = styled.div`
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #eef2f3;
  color: #2d2d2d;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.header`
  background: linear-gradient(135deg,rgb(0, 0, 0), #2a5298);
  color: white;
  padding: 20px;
  text-align: center;
  width: 100%;
  position: relative;
  box-shadow: 0 4px 8px rgba(74, 73, 73, 0.2);
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 2.5rem;
  animation: ${fadeIn} 1s ease-in-out;
`;

const Main = styled.main`
  padding: 20px;
  max-width: 900px;
  margin: auto;
  text-align: center;
  width: 100%;
`;

const Introduction = styled.section`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Line = styled.p`
  opacity: 0;
  animation: ${lineFadeIn} 0.5s ease-in-out forwards;
  animation-delay: ${(props) => props.delay}s;
`;

const Features = styled.section`
  text-align: center;
  margin-bottom: 20px;
`;

const FeatureButtons = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  @media (min-width: 600px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const FeatureButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color:rgb(192, 243, 171);
  color: black;
  font-weight: bold;
  border: none;
  padding: 15px 25px;
  cursor: pointer;
  border-radius: 25px;
  transition: background-color 0.3s, transform 0.3s;
  font-size: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 250px;
  text-align: left;

  &:hover {
    background-color:rgb(117, 244, 108);
    transform: scale(1.05);
  }

  svg {
    margin-left: auto;
  }
`;

const FeatureDetails = styled.div`
  margin-top: 15px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
  animation: ${fadeIn} 0.5s ease-in-out;
  max-width: 800px;
  margin: auto;

  h3 {
    font-size: 1.5rem;
    color: #1e3c72;
    margin-bottom: 10px;
  }

  p {
    font-size: 1rem;
    line-height: 1.6;
    color: #555;
  }
`;

const DeveloperProfile = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  img {
    border-radius: 50%;
    margin-right: 20px;
    width: 80px;
    height: 80px;
    object-fit: cover;
  }

  div {
    text-align: left;

    h4 {
      margin: 0;
      font-size: 1.2rem;
      color: #1e3c72;
      display: flex;
      align-items: center;
    }

    p {
      margin: 5px 0 0;
      font-size: 1rem;
      color: #555;
    }
  }
`;

const LinkedInIcon = styled(FaLinkedin)`
  margin-left: 8px;
  color: #0A66C2;
  font-size: 1.2rem;
  transition: color 0.3s;

  &:hover {
    color: #004182;
  }
`;

const About = () => {
  const [visibleSection, setVisibleSection] = useState(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleDetails = (section) => {
    setVisibleSection(visibleSection === section ? null : section);
    if (detailsRef.current) {
      if (visibleSection === section) {
        window.scrollTo(0, 0);
      } else {
        setTimeout(() => {
          detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  };

  const developers = [
    {
      name: 'A.S.M.Tahsin Tajware',
      role: 'Frontend & Backend',
      image: TahsinImage,
      bio: 'Develops both frontend and backend solutions, ensuring seamless functionality.',
      linkedin: 'https://www.linkedin.com/in/tahsintajware'
    },
    {
      name: 'Abdullah Al Tamim',
      role: 'Lead',
      image: TamimImage,
      bio: 'Leads the team, driving innovation and maintaining high standards.',
      linkedin: 'https://www.linkedin.com/in/abdullah-al-tamim-b6a3b1222'
    },
    {
      name: 'Nasidur Rahman Auloy',
      role: 'Frontend',
      image: AuloyImage,
      bio: 'Develops intuitive user interfaces, enhancing the user experience.',
      linkedin: 'https://www.linkedin.com/in/nasidur-rahman-a21397262'
    },
    {
      name: 'Sonod Sadman',
      role: 'Backend',
      image: SonodImage,
      bio: 'Ensures robust and scalable backend performance.',
      linkedin: 'https://www.linkedin.com/in/sonod-sadman-3b578133b'
    },
  ];

  return (
    <AboutPage>
      <Header>
        <HeaderTitle>About CourseMate</HeaderTitle>
        <p>A platform for academic course related question & answer.</p>
      </Header>

      <Main>
        <Introduction>
          <Line delay={0}>CourseMate is a web-based Q&A platform designed to enhance academic interaction</Line>
          <Line delay={0.5}>and knowledge sharing within university courses. It provides a centralized system</Line>
          <Line delay={1}>where students and teachers can interact, share insights, and engage in meaningful</Line>
          <Line delay={1.5}>discussions focused on academic growth and quality.</Line>
        </Introduction>

        <Features>
          <FeatureButtons>
            {['developers', 'mission', 'vision', 'project'].map((section) => (
              <FeatureButton key={section} onClick={() => toggleDetails(section)}>
                {section.charAt(0).toUpperCase() + section.slice(1)}
                {visibleSection === section ? <FaChevronUp /> : <FaChevronDown />}
              </FeatureButton>
            ))}
          </FeatureButtons>

          <div ref={detailsRef}>
            {visibleSection === 'developers' && (
              <FeatureDetails>
                <h3>Meet the Developers</h3>
                {developers.map((developer, index) => (
                  <DeveloperProfile key={index}>
                    <img src={developer.image} alt={developer.name} />
                    <div>
                      <h4>
                        {developer.name}
                        <a href={developer.linkedin} target="_blank" rel="noopener noreferrer" title="Navigate to LinkedIn">
                          <LinkedInIcon />
                        </a>
                      </h4>
                      <p>{developer.role}</p>
                      <p>{developer.bio}</p>
                    </div>
                  </DeveloperProfile>
                ))}
              </FeatureDetails>
            )}

            {visibleSection === 'mission' && (
              <FeatureDetails>
              <h3>Our Mission</h3>
              <p>
                Our mission is to revolutionize academic collaboration by providing a centralized
                web-based Q&A platform where students and educators can seamlessly interact,
                share knowledge, and engage in meaningful discussions. We believe in breaking
                traditional barriers in learning and creating an inclusive space where every
                question finds its answer, and every learner finds guidance.
              </p>
              <p>
                Through course-specific discussions, structured knowledge preservation, and
                quality control, we aim to empower students and staff by giving them access to
                a rich academic community that values integrity, engagement, and shared growth.
                Our goal is to enhance the way knowledge is exchanged, ensuring that learning
                extends beyond the classroom and fosters a culture of lifelong curiosity and
                academic excellence.
              </p>
            </FeatureDetails>
            )}

            {visibleSection === 'vision' && (
              <FeatureDetails>
              <h3>Our Vision</h3>
              <p>
                We envision a world where learning is limitless, knowledge is accessible, and
                academic communities thrive together. Our platform aspires to become the go-to
                hub for students and educators, where discussions are structured, insights are
                preserved, and intellectual engagement is encouraged.
              </p>
              <p>
                By integrating secure authentication, gamified engagement, and efficient content
                moderation, we are committed to building an ecosystem that upholds academic integrity,
                fosters meaningful connections, and creates a national-level impact. We see a future
                where education is no longer confined to classrooms but extends into a dynamic,
                collaborative, and innovative digital space, empowering learners to ask, explore,
                and grow without limits.
              </p>
            </FeatureDetails>
            )}

            {visibleSection === 'project' && (
              <FeatureDetails>
              <h3>Our Project</h3>
              <p>Our platform is designed to:</p>
              <ul>
                <li>✅ Streamline academic discussions with course-specific organization.</li>
                <li>✅ Ensure content quality through user reputation and moderation.</li>
                <li>✅ Encourage participation via gamification and incentives.</li>
                <li>✅ Secure authentication to maintain a safe academic space.</li>
                <li>✅ Provide efficient knowledge discovery for students and educators.</li>
              </ul>
              <p>
                By addressing the lack of a centralized platform and encouraging collaborative learning,
                our project aspires to redefine online academic engagement and make a lasting impact on education.
              </p>
            </FeatureDetails>
            )}
          </div>
        </Features>
      </Main>
    </AboutPage>
  );
};

export default About;
