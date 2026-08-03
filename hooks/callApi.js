export const callApi = async (input) => {
  try {
    const res = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: input }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message = data?.error || "Something went wrong. Please try again.";
      alert(message);
      return { success: false, error: true, data: null };
    }

    if (!data) {
      alert("No response received. Please try again.");
      return { success: false, error: true, data: null };
    }

    return { success: true, error: false, data };
  } catch (err) {
    console.error(err);
    alert(err?.message || "Something went wrong. Please try again.");
    return { success: false, error: true, data: null };
  }
};
