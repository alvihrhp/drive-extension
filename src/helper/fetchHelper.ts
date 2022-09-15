async function fetchHelper(
  url: string,
  method: string,
  data?: { [key: string]: any },
  content?: string
) {
  try {
    const checkContent = !content ? "application/json" : content;

    const response: any = await fetch(url, {
      method: method,
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      redirect: "follow",
      referrerPolicy: "no-referrer",
      headers: {
        Accept: "application/json",
        "Content-Type": checkContent,
      },
      body: JSON.stringify(data),
    });

    const responseJSON: { [key: string]: any } = await response.json();

    switch (response.status) {
      case 400:
        throw responseJSON;
    }

    return responseJSON.data;
  } catch (error) {
    throw error;
  }
}

export default fetchHelper;
