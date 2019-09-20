# Delete CloudFormation Stack
echo "Please enter Auto Scaling Stack Name:"
read autoScaleStackName
if [ -z "$autoScaleStackName" ]
then
	echo "StackName error exiting!"
	exit 1
fi
echo "$autoScaleStackName"

echo "Please enter S3 Bucket Name:"
read s3bucket
if [ -z "$s3bucket" ]
then
	echo "StackName error exiting!"
	exit 1
fi
echo "$s3bucket"

echo "Deleting S3 Bucket objects"
aws s3 rm s3://$s3bucket/ --recursive
echo "S3 Bucket objects deleted successfully"

echo "Deleting CloudFormation Stack"
aws cloudformation delete-stack --stack-name $autoScaleStackName

aws cloudformation wait stack-delete-complete --stack-name $autoScaleStackName

echo "Cloudformation Stack deleted"
