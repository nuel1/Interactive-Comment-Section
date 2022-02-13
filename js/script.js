"use strict";

import { $DATA } from "./data.js";
import { reply, Time } from "./event.js";
import { createUserComment, createNestedComment } from "./template.js";

/**
 * Basically a check to switch between currentUser template and the other users'
 * template by marking isCurrentUser as either {true} or {false}
 **/

export let isCurrentUser = false;

(function () {
  const buildTemplate = () => {
    const mainUl = document.querySelector(".comment__container");
    let func;

    $DATA.comments.forEach((comment) => {
      let li, div;
      let user__name = $DATA.currentUser.username;

      if (comment.user.username === user__name) {
        isCurrentUser = true;
        li = createUserComment.call(comment);
      } else {
        isCurrentUser = false;
        li = createUserComment.call(comment);
        div = createNestedComment.call(comment);
      }

      if (comment.replies && comment.replies.length) {
        comment.replies.forEach((reply) => {
          func = () => {
            const eLi = createUserComment.call(reply);
            const ul = div.firstElementChild;
            ul.append(eLi);
          };

          isCurrentUser
            ? (func(), (isCurrentUser = false))
            : (func(), (isCurrentUser = true));
        });
      }

      if (div) li.append(div);
      mainUl.append(li);
    });
  };

  buildTemplate();

  isCurrentUser = true;
})();

const newId = () => {
  let id;
  const ids = [];

  $DATA.comments.forEach((comment) => {
    ids.push(comment.id);
    if (comment.replies && comment.replies.length) {
      comment.replies.forEach((item) => ids.push(item.id));
    }
  });

  id = Math.max(...ids) + 1;

  return id;
};

class User {
  constructor(username, { ...imgSrc }) {
    this.id = newId();
    this.content = "";
    this.createdAt = "";
    this.user = {
      image: imgSrc,
      username: username,
    };

    this.replies = [];
    this.score = 0;
    Object.defineProperty(this, "active", {
      enumerable: false,
      writable: true,
      value: true,
    });
  }
}

export class CurrentUser extends User {
  constructor(username, { ...imgSrc }) {
    super(username, { ...imgSrc });
    Object.defineProperty(this, Symbol.toStringTag, {
      enumerable: false,
      value: "Current User",
    });
  }
}
