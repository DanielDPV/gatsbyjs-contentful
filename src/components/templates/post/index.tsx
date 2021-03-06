import React from 'react';
import { graphql, Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokaiSublime } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import IframeContainer from '../../IframeContainer';
import MainLayout from '../../layouts/MainLayout';
import Routes from '../../../routes/routes';

export const query = graphql`
  query($slug: String!) {
    contentfulBlogPost(slug: { eq: $slug }) {
      title
      publishedDate
      mainImage {
        gatsbyImageData(layout: CONSTRAINED, placeholder: BLURRED)
        contentful_id
        title
        file {
          url
        }
      }
      tags {
        description
      }
      body {
        raw
        references {
          gatsbyImageData(layout: CONSTRAINED, placeholder: BLURRED)
          contentful_id
          title
          file {
            url
          }
        }
      }
    }
  }
`;

const Post = ({ data }: any) => {

  const { contentfulBlogPost } = data;

  const options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: node => {
        const id = node.data.target.sys.id;
        const resource = contentfulBlogPost.body.references.find(
          ref => ref.contentful_id === id
        );
        return (
          <GatsbyImage
            image={resource.gatsbyImageData}
            alt={resource.title}
            style={{ display: 'flex', justifyContent: 'center' }}
          />
        );
      },
      [INLINES.HYPERLINK]: node => {
        if (node.data.uri.includes('player.vimeo.com/video')) {
          return (
            <IframeContainer>
              <iframe
                title="Unique Title 001"
                src={node.data.uri}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </IframeContainer>
          );
        } else if (node.data.uri.includes('youtube.com/embed')) {
          return (
            <IframeContainer>
              <iframe
                title="Unique Title 002"
                src={node.data.uri}
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </IframeContainer>
          );
        }

        return (
          <a href={node.data.uri} target="_blank" rel="noopener noreferrer">
            {node.content[0].value}
          </a>
        );
      },
    },
    renderMark: {
      [MARKS.CODE]: node => {
        return (
          <SyntaxHighlighter
            language="javascript"
            style={monokaiSublime}
            customStyle={{ fontSize: 15 }}
            PreTag={({ children, ...preProps }) => (
              <span {...preProps}>{children}</span>
            )}
            showLineNumbers
          >
            {node}
          </SyntaxHighlighter>
        );
      },
    },
  };

  return (
    <MainLayout>
      <div className="my-20 w-full">
        <div className="flex justify-center">
          <div className="w-3/4 lg:w-1/3">
            <h1 className="text-3xl font-serif text-center">
              {contentfulBlogPost.title}
            </h1>
            <p className="text-sm italic text-gray-500 text-center">
              {contentfulBlogPost.publishedDate}
            </p>
            <hr />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="bg-white rounded shadow-md hover:shadow-lg p-6 m-2 w-3/4 lg:w-2/3">
            <div className="rich-content">
              {documentToReactComponents(
                JSON.parse(contentfulBlogPost.body.raw),
                options
              )}
            </div>
            <div className="text-center sm:text-left">
              <Link
                to={Routes.HOME}
                className="hover:text-blue-400 text-gray-400"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
                {'\u00A0'}Go back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Post;
