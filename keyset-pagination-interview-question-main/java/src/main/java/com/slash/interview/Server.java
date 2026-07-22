package com.slash.interview;

import io.javalin.Javalin;

public final class Server {

  private static final int PORT = 7000;

  public static void main(String[] args) {
    Javalin app = Javalin.create();

    /*
     * GET /query?dataset=<name>&sort=<base64>&page_size=<int>&cursor=<base64>
     *
     * Return a paginated, sorted view of a dataset.
     * See README.md for the full spec.
     */
    app.get("/query", ctx -> {
      String dataset = ctx.queryParam("dataset");
      String sort = ctx.queryParam("sort");
      String pageSize = ctx.queryParam("page_size");
      String cursor = ctx.queryParam("cursor");

      throw new UnsupportedOperationException("implement me");
    });

    app.start(PORT);
    System.out.println("Server running on http://localhost:" + PORT);
  }
}
