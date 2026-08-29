
namespace RooftopGarden.Application.Common.Interfaces
{
    public interface IImageStorage
    {
        Task<StoredImage> UploadAsync(ImageUploadRequest request, CancellationToken cancellationToken);
        Task DeleteAsync(string publicId, CancellationToken cancellationToken);
    }

    public sealed record ImageUploadRequest(string FileName, Stream Content, ImageStorageFolder Folder);

    public sealed record StoredImage(string Url, string PublicId);

    public enum ImageStorageFolder
    {
        Product,
        Blog,
        Avatar
    }
}
