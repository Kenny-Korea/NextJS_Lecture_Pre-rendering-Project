import { Fragment } from "react";
import Head from "next/head";

import {
  getAllEvents,
  getEventById,
  getFeaturedEvents,
} from "../../helpers/api-util";
import EventSummary from "../../components/event-detail/event-summary";
import EventLogistics from "../../components/event-detail/event-logistics";
import EventContent from "../../components/event-detail/event-content";
import ErrorAlert from "../../components/ui/error-alert";

function EventDetailPage(props) {
  // 아래에 이벤트에 대한 정보 데이터가 있으므로, useRouter를 통해 정보를 받을 필요 없음
  // (getStaticPaths 함수에서 이미 필요한 데이터를 만들어두었기 때문)
  const event = props.selectedEvent;

  if (!event) {
    return (
      <div className="center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{event.title}</title>
        <meta
          name="description"
          content="Find a lot of great events that allow you to evolve"
        />
      </Head>
      <EventSummary title={event.title} />
      <EventLogistics
        date={event.date}
        address={event.location}
        image={event.image}
        imageAlt={event.title}
      />
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
    </>
  );
}

// detail 페이지의 데이터는 세부 정보를 담고 있기 때문에 더욱 중요 --> SEO 필수
// 데이터가 수시로 변경되지는 않음 --> SSG

export async function getStaticProps(context) {
  const eventId = context.params.eventId;

  const event = await getEventById(eventId);

  return {
    props: {
      selectedEvent: event,
    },
    revalidate: 30,
  };
}

export async function getStaticPaths() {
  // 모든 이벤트를 사전 생성하는 것은 비효율적이므로
  // 주요 이벤트를 보여주는 featuredEvents를 사전 생성하도록 함
  const events = await getFeaturedEvents();
  // const events = await getAllEvents();

  const paths = events.map((event) => ({ params: { eventId: event.id } }));

  return {
    paths: paths,
    // featuredEvents만 사전 생성되므로, fallback: false로 생성하면 p1의 경우 404페이지가 출력됨
    fallback: "blocking",
  };
}

export default EventDetailPage;
