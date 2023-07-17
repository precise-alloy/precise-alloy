import mockFetch from "@mock/core/fetch";

window.originFetch = window.fetch;

window.fetch = mockFetch;