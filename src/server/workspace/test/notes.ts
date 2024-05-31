class Notes {
  private title: string;
  private content: string;
  private createdAt: Date;
  private updatedAt: Date;
  private isArchived: boolean;

  public constructor(title: string, content: string) {
    this.title = title;
    this.content = content;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.isArchived = false;
  }

  public getTitle(): string {
    return this.title;
  }

  public setTitle(newTitle: string): void {
    this.title = newTitle;
    this.updatedAt = new Date();
  }

  public getContent(): string {
    return this.content;
  }

  public setContent(newContent: string): void {
    this.updatedAt = new Date();
    this.content = newContent;
  }

  archive(): void {
    this.isArchived = true;
    this.updatedAt = new Date();
  }

  unarchive(): void {
    this.isArchived = false;
    this.updatedAt = new Date();
  }

  getDetails() {
    return {
      title: this.title,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isArchived: this.isArchived,
    };
  }
}
