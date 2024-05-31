class Model {
  private modelID: string;
  private name: string;
  private imagePreview: number;
  private metaData: string;
  private transform: number[];
  private rotate: number[];
  private scale: number[];

  public constructor(name: string, imagePreview: number, metaData: string) {
    this.name = name;
    this.imagePreview = imagePreview;
    this.metaData = metaData;
    this.transform = [0, 0, 0];
    this.rotate = [0, 0, 0];
    this.scale = [0, 0, 0];
  }

  getName(): string {
    return this.name;
  }

  setName(newName: string): void {
    this.name = newName;
  }

  getImagePreview(): number {
    return this.imagePreview;
  }

  setImagePreview(newImagePreview: number): void {
    this.imagePreview = newImagePreview;
  }

  getMetaData(): string {
    return this.metaData;
  }

  setMetaData(newMetaData: string): void {
    this.metaData = newMetaData;
  }

  getTransform(): number[] {
    return this.transform;
  }

  setTransform(newTransform: number[]): void {
    this.transform = newTransform;
  }

  getRotate(): number[] {
    return this.rotate;
  }

  setRotate(newRotate: number[]): void {
    this.rotate = newRotate;
  }

  getScale(): number[] {
    return this.scale;
  }

  setScale(newScale: number[]): void {
    this.scale = newScale;
  }
}
