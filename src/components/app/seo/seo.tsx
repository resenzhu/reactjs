import {Helmet} from 'react-helmet-async';
import seoImage from './../../../assets/app/images/app.seo.webp';

type Seo =
{
  title: string,
  description: string,
  image?: string
};

type OgTag =
{
  property: string,
  content: string
};

type TwitterTag =
{
  name: string,
  content: string
};

const Seo = ({title, description, image = seoImage}: Seo): JSX.Element =>
{
  const canonicalUrl: string = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;

  const ogTags: OgTag[] =
  [
    {
      property: 'og:title',
      content: title
    },
    {
      property: 'og:description',
      content: description
    },
    {
      property: 'og:image',
      content: image
    },
    {
      property: 'og:url',
      content: canonicalUrl
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ];

  const twitterTags: TwitterTag[] =
  [
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: title
    },
    {
      name: 'twitter:description',
      content: description
    },
    {
      name: 'twitter:image',
      content: image
    }
  ];

  return (
    <Helmet
      prioritizeSeoTags={true}
      defer={false}
    >
      <title>
        {title}
      </title>
      <meta
        name='title'
        content={title}
      />
      <meta
        name='description'
        content={description}
      />
      <meta
        itemProp='name'
        content={title}
      />
      <meta
        itemProp='description'
        content={description}
      />
      <meta
        itemProp='image'
        content={image}
      />
      {
        ogTags.map(({property, content}): JSX.Element =>
        (
          <meta
            key={property}
            property={property}
            content={content}
          />
        ))
      }
      {
        twitterTags.map(({name, content}): JSX.Element =>
        (
          <meta
            key={name}
            name={name}
            content={content}
          />
        ))
      }
      <link
        rel='canonical'
        href={canonicalUrl}
      />
    </Helmet>
  );
};

export default Seo;
