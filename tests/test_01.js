const {
  setupFixture,
  setTestContext,
  faker,
  wrapTest,
  dataCleanUp
} = require("./utilities/todo_utils");
const { Selector } = require("testcafe");
setupFixture();

const meta = {
  id: "a9f799d3-fd55-4c49-b46a-69fd8cd97ebc",
  steps: [
    "Open home page",
    "Hover on the add button",
    "ASSERTION: tooltip exists on button hover",
    "Click the add button",
    "ASSERTION: Add todo text exists on the popup modal",
    "Enter Category",
    "Enter Description",
    "Enter due date",
    "ASSERTION: Submit button is activated",
    "Click the submit button",
    "ASSERTION: Item is append to the todo list"
  ],
};

wrapTest(meta)("add_todos", async (t) => {
  const { getLocation } = setTestContext(t);
  const category = "sports";
  const description = faker.lorem.sentence(5);
  const dueDate = "2021-04-12";
  await t
    .expect(getLocation())
    .match(/.*\//)
    .hover(Selector("span > button").withText(/\+/i))
    .expect(Selector("div").withAttribute("role", "tooltip").exists)
    .ok()
    .click(Selector("span > button").withText(/\+/i))
    .expect(Selector(".modal-title").withText("Add Todo").exists)
    .ok();

  await t
    .typeText(Selector("input[name='category']"), category, {
      replace: true,
      paster: true,
    })
    .typeText(Selector("textarea[name='description']"), description, {
      replace: true,
      paster: true,
    })
    .click(Selector("input[name='dueDate']"))
    .typeText(Selector("input[name='dueDate']"), dueDate)
    .expect(Selector("button[name='addTodo']").filterVisible().exists).ok()
    .click(Selector("button[name='addTodo']"))
    .expect(Selector("div.list-group > .list-group-item").find("div").withText(description).exists).ok();
  await dataCleanUp(t);
});
