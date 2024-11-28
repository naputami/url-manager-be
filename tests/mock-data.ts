export const mockUser = {
  id: "mock_id",
  name: "John",
  email: "john@example.com",
  createdAt: new Date("2024-11-27"),
  updatedAt: new Date("2024-11-27"),
  password: "mock_password",
};

export const mockSession = {
  id: "mock_session_id",
  createdAt: new Date("2024-11-27"),
  userId: "mock_user_id",
};

export const mockCategory = {
  name: "category name",
  id: "cat1",
  userId: mockUser.id,
  createdAt: new Date("2024-11-27"),
  updatedAt: new Date("2024-11-27"),
};

export const mockLink = {
  id: "link1",
  userId: "user1",
  createdAt: new Date("2024-11-27"),
  updatedAt: new Date("2024-11-27"),
  summary: "this is summary link",
  link: "https://www.dummylink.com",
  title: "this is dummy link",
  categoryId: "cat1",
};

export const mockLinkItemList = {
  id: "link1",
  userId: "user1",
  summary: "this is summary link",
  link: "https://www.dummylink.com",
  title: "this is dummy link",
  categoryId: "cat1"
}

export const mockUpdatedLink = {
  userId: "user1",
  summary: "this is summary link",
  link: "https://www.dummylink.com",
  title: "this is dummy link",
  categoryId: "cat1",
}