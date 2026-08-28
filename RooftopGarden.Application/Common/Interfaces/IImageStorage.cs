
namespace RooftopGarden.Application.Common.Interfaces
{
    public interface IImageStorage
    {
        Task<StoredImage> UploadAsync(ImageUploadRequest request, CancellationToken cancellationToken);
        Task DeleteAsync(string publicId, CancellationToken cancellationToken);
    }

    public sealed record ImageUploadRequest(string FileName, Stream Content,string Folder);

    public sealed record StoredImage(string Url, string PublicId);
}
